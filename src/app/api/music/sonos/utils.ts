import { AsyncDeviceDiscovery, SpotifyRegion as Regions, Sonos } from "sonos";

// find one device
// Useful for finding all the IP addresses of devices.
export const deviceDiscovery = async () => {
  const DeviceDiscovery = new AsyncDeviceDiscovery();

  const devices = await DeviceDiscovery.discover();

  const sonos = new Sonos(devices.host);
  const groups = await sonos.getAllGroups();
  // @ts-expect-error TODO: fix this
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
  return;
  // const state = await device.getCurrentState();
  // return state;
};

export const playMusicInRoom = async (ipAddress: string, uri: string) => {
  const device = new Sonos(ipAddress);

  await device.play(uri);
  return;
  // const state = await device.getCurrentState();
  // return state;
};

export const setRoomVolume = async (ipAddress: string, volume: number) => {
  const device = new Sonos(ipAddress);

  await device.setVolume(volume);
  return;
  // const state = await device.getVolume();
  // return state;
};

export const pauseRoom = async (ipAddress: string) => {
  const device = new Sonos(ipAddress);

  await device.pause();
  return;
  // const state = await device.getCurrentState();
  // return state;
};

export const toggleRoom = async (ipAddress: string) => {
  try {
    const device = new Sonos(ipAddress);
    await device.togglePlayback();
    // return info;
    // const state = await device.getCurrentState();
    // return state;
    return "success";
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
  return;
  // const state = await device.getCurrentState();
  // return state;
};

export const getFavorites = async (ipAddress: string) => {
  const device = new Sonos(ipAddress);

  const sonosFavorites = await device
    .getFavorites()
    // @ts-expect-error TODO: fix this
    .catch((e) => {
      console.error("Error occurred %j", e);
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
  // @ts-expect-error TODO: fix this
  const favoriteItems = sonosFavorites.items.filter((item) => item.uri);

  const formattedFavorites = {};
  // @ts-expect-error TODO: fix this
  favoriteItems.forEach((item) => {
    const returnObj = {
      title: item.title,
    };

    const type = item.uri.replace(/(^:)|(:$)/g, "");
    const split = type.replace(/(^:)|(:$)/g, "").split(":");

    if (split[0] === "x-sonosapi-stream") {
      // @ts-expect-error TODO: fix this

      returnObj.type = "tunein";
      // @ts-expect-error TODO: fix this

      returnObj.id = split[1].split("?")[0];
    } else if (split[0] === "x-rincon-mp3radio") {
      // @ts-expect-error TODO: fix this
      returnObj.type = "mp3";
      // @ts-expect-error TODO: fix this
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
      // @ts-expect-error TODO: fix this

      returnObj.id = `spotify:${beforeQuestion[1]}:${beforeQuestion[2]}`;
      // @ts-expect-error TODO: fix this

      returnObj.type = "spotify";
    }
    // @ts-expect-error TODO: fix this
    formattedFavorites[item.title] = returnObj;
  });

  return {
    formattedFavorites: Object.values(formattedFavorites).filter((fav) => {
      // @ts-expect-error TODO: fix this
      return !!fav.type && !!fav.url;
    }),
    sonosFavorites,
  };
};

export const playFavorite = async (
  ipAddress: string,
  favorite: { url: string; title: string; id: string; type: string }
) => {
  const device = new Sonos(ipAddress);

  device.setSpotifyRegion(Regions.EU);

  let currentTrack = null;

  if (favorite.type === "tunein") {
    currentTrack = await device
      .playTuneinRadio(favorite.id, favorite.title)
      // .then(() => {
      //   return device.currentTrack();
      // })
      // @ts-expect-error TODO: fix this
      .catch((e) => {
        console.error("Error occurred", e);
      });
  } else if (favorite.type === "mp3") {
    currentTrack = await device
      .play(favorite.url)
      .then(() => {
        return device.currentTrack();
      })
      // @ts-expect-error TODO: fix this
      .catch((e) => {
        console.error("Error occurred", e);
      });
  } else if (favorite.type === "spotify") {
    const spotifyUri = `${favorite.id}`;

    currentTrack = await device
      .play(spotifyUri)
      .then(() => {
        return device.currentTrack();
      })
      // @ts-expect-error TODO: fix this
      .catch((e) => {
        console.error("Error occurred: ", e);
      });
  } else if (favorite.type === "spotify-playlist") {
    const spotifyUri = `spotify:playlist:${favorite.id}`;
    currentTrack = await device
      .play(spotifyUri)
      // .then(() => {
      //   return device.currentTrack();
      // })
      // @ts-expect-error TODO: fix this
      .catch((e) => {
        console.error("Error occurred: ", e);
      });
  } else {
    console.error("you didn't choose an available option");
  }

  return currentTrack;
};

// export const playFavoriteWithStatuses = async (
//   favorite: Room,
//   roomToPlay = ""
// ) => {
//   const ipAddress = getRoomIpAddress(roomToPlay);
//   const device = new Sonos(ipAddress);

//   const statusBefore = await device.getCurrentState(roomToPlay);

//   const currentTrack = await playFavorite(favorite, roomToPlay);

//   const status = await device.getCurrentState(roomToPlay);

//   return {
//     currentTrack,
//     favorite,
//     status,
//     statusBefore,
//   };
// };

const availableRooms = [
  { id: "Blanc", name: "Blanc", ipAddress: getRoomIpAddress("Blanc") },
  { id: "Bedroom", name: "Bedroom", ipAddress: getRoomIpAddress("Bedroom") },
];

type Status = {
  state: string;
  volume: number;
  currentTrack: string;
  muted: boolean;
};

export const getStatuses = async () => {
  const statusPromises = availableRooms.map((room) =>
    statusRoom(room.ipAddress)
  );
  const statuses: Array<Status> = await Promise.all(statusPromises);
  return statuses;
};

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

  return true;
};
