import { AsyncDeviceDiscovery, SpotifyRegion as Regions, Sonos } from "sonos";

// find one device
// Useful for finding all the IP addresses of devices.
export const deviceDiscovery = async () => {
  const DeviceDiscovery = new AsyncDeviceDiscovery();

  const devices = await DeviceDiscovery.discover();

  const sonos = new Sonos(devices.host);
  const groups = await sonos.getAllGroups();

  return groups.map((group) => ({ host: group.host, name: group.Name }));
};

export type Room = "Blanc" | "Bedroom";

export const getRoomIpAddress = (room: Room) => {
  let ipAddress = "";

  switch (room) {
    case "Blanc": // Kitchen
      ipAddress = process.env.SONOS_KITCHEN_IP!;
      break;

    case "Bedroom":
    default:
      ipAddress = process.env.SONOS_BEDROOM_IP!;
      break;
  }
  return ipAddress;
};

export const playRoom = async (ipAddress: string) => {
  const device = new Sonos(ipAddress);

  await device.play();
  const state = await device.getCurrentState();
  return state;
};

export const playMusicInRoom = async (ipAddress: string, url: string) => {
  const device = new Sonos(ipAddress);

  await device.play(url);
  const state = await device.getCurrentState();
  return state;
};

export const setRoomVolume = async (ipAddress: string, volume: number) => {
  const device = new Sonos(ipAddress);

  await device.setVolume(volume);
  const state = await device.getVolume();
  return state;
};

export const pauseRoom = async (ipAddress: string) => {
  const device = new Sonos(ipAddress);

  await device.pause();
  const state = await device.getCurrentState();
  return state;
};

export const toggleRoom = async (ipAddress: string) => {
  try {
    const device = new Sonos(ipAddress);
    await device.togglePlayback();
    const state = await device.getCurrentState();
    return state;
  } catch (e) {
    console.error("error in toggleRoom", e);
  }
};

export const statusRoom = async (ipAddress: string) => {
  const device = new Sonos(ipAddress);

  const volume = await device.getVolume();
  const state = await device.getCurrentState();
  const currentTrack = await device.currentTrack();
  const muted = await device.getMuted();

  return { volume, state, currentTrack, muted };
};

export const toggleMute = async (roomToPlay: Room) => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const muted = await device.getMuted();

  await device.setMuted(!muted);
  const state = await device.getCurrentState();
  return state;
};

export const getFavorites = async (roomToPlay: Room) => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const sonosFavorites = await device
    .getFavorites()
    .then((favorites) => {
      return favorites;
    })
    .catch((e) => {
      console.log("Error occurred %j", e);
    });

  // // This assumes you have the Spotify music service connected to
  // // your Sonos system.

  // const favorites = {
  //   "6music": {
  //     type: "tunein",
  //     title: "BBC Radio 6 Music",
  //     id: "s44491",
  //   },
  //   fip: {
  //     type: "mp3",
  //     title: "fip",
  //     url: "http://icecast.radiofrance.fr/fip-midfi.mp3",
  //   },
  //   earthtones: {
  //     type: "spotify",
  //     title: "earthtones",
  //     id: "album:2mn50aOZXBLAf66gZVuFAo",
  //   },
  //   "70s-Disco": {
  //     type: "spotify",
  //     title: "70s disco",
  //     id: "playlist:3AtFItPTNrmxqREWOWZV6e",
  //   },
  //   somafm: {
  //     type: "mp3",
  //     title: "somafm",
  //     url:
  //       "x-rincon-mp3radio://http://www.abc.net.au/res/streaming/audio/aac/dig_music.pls",
  //   },
  // };

  // // get random property from an object.
  const favoriteItems = sonosFavorites.items.filter((item) => item.uri);

  const formattedFavorites = {};
  favoriteItems.forEach((item) => {
    const returnObj: any = {
      title: item.title,
    };

    const type = item.uri.replace(/(^:)|(:$)/g, "");
    const split = type.replace(/(^:)|(:$)/g, "").split(":");

    if (split[0] === "x-sonosapi-stream") {
      returnObj.type = "tunein";
      returnObj.id = split[1].split("?")[0];
    } else if (split[0] === "x-rincon-mp3radio") {
      returnObj.type = "mp3";
      returnObj.url = type;
    } else if (split[0] === "x-rincon-cpcontainer") {
      if (!split[1].includes("spotify")) {
        return;
      }
      const beforeQuestion = split[1]
        .split("?")[0]
        .replace(/%3a/g, ":")
        .split(":");

      // either spotify-album or spotify-playlist
      returnObj.id = `spotify:${beforeQuestion[1]}:${beforeQuestion[2]}`;
      returnObj.type = "spotify";
    }

    formattedFavorites[item.title] = returnObj;
  });

  return { formattedFavorites, sonosFavorites };
};

export const playFavorite = async (favorite, roomToPlay = "") => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  device.setSpotifyRegion(Regions.EU);

  let currentTrack = null;

  if (favorite.type === "tunein") {
    currentTrack = await device
      .playTuneinRadio(favorite.id, favorite.title)
      .then((success) => {
        // console.log("Yeay tunein playing", favorite.title);
        return device.currentTrack();
      })
      .catch((e) => {
        console.log("Error occurred", e);
      });
  } else if (favorite.type === "mp3") {
    currentTrack = await device
      .play(favorite.url)
      .then((success) => {
        // console.log("Yeay mp3 playing", favorite.title);
        return device.currentTrack();
      })
      .catch((e) => {
        console.log("Error occurred", e);
      });
  } else if (favorite.type === "spotify") {
    const spotifyUri = `${favorite.id}`;

    currentTrack = await device
      .play(spotifyUri)
      .then((success) => {
        // console.log("Yeay, spotify album playing", favorite.title);
        return device.currentTrack();
      })
      .catch((e) => {
        console.log("Error occurred: ", e);
      });
  } else if (favorite.type === "spotify-playlist") {
    const spotifyUri = `spotify:playlist:${favorite.id}`;
    currentTrack = await device
      .play(spotifyUri)
      .then((success) => {
        // console.log("Yeay, spotify Playlist playing", favorite.title);
        return device.currentTrack();
      })
      .catch((e) => {
        console.log("Error occurred: ", e);
      });
  } else {
    console.log("you didn't choose an available option");
  }

  return currentTrack;
};

export const playFavoriteWithStatuses = async (favorite, roomToPlay = "") => {
  const ipAddress = getRoomIpAddress(roomToPlay);
  const device = new Sonos(ipAddress);

  const statusBefore = await device.getCurrentState(roomToPlay);

  const currentTrack = await playFavorite(favorite, roomToPlay);

  const status = await device.getCurrentState(roomToPlay);

  return {
    currentTrack,
    favorite,
    status,
    statusBefore,
  };
};

const availableRooms = [
  { id: "Blanc", name: "Blanc", ipAddress: getRoomIpAddress("Blanc") },
  { id: "Bedroom", name: "Bedroom", ipAddress: getRoomIpAddress("Bedroom") },
];

export const handleAll = async (method = "pause") => {
  if (method === "pause" || method === "play") {
    await availableRooms.reduce(async (previousPromise, nextID) => {
      await previousPromise;

      if (method === "pause") {
        return pauseRoom(nextID.ipAddress);
      } else {
        return playRoom(nextID.ipAddress);
      }
    }, Promise.resolve());
  }

  const statuses = [];
  await availableRooms.reduce(async (previousPromise, nextID) => {
    await previousPromise;
    const { state, volume, currentTrack, muted } = await statusRoom(
      nextID.ipAddress
    );
    statuses.push({ state, volume, currentTrack, muted, room: nextID.id });
    return state;
  }, Promise.resolve());

  return statuses;
};
