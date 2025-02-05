import { XMLParser } from "fast-xml-parser";

type BluesoundResponse = {
  status?: {
    state: string;
    volume: number;
    title1: string;
  };
  state?: string;
};

export const playMusic = async () => {
  const { state } = await getStateFromFetch("Play");

  return state;
};

export const toggleMusic = async () => {
  const { state } = await getStateFromFetch("Pause?toggle=1");
  return state;
};

export const playFavorite = async (presetId: string) => {
  const { state } = await getStateFromFetch(`Preset?id=${presetId}`);

  return state;
};

export const pauseMusic = async () => {
  const { state } = await getStateFromFetch("Pause");

  return state;
};

export const setVolume = async (volume: number) => {
  const { state } = await getStateFromFetch(`Volume?level=${volume}`);

  return state;
};

export const getFavorites = async () => {
  const response = await fetch(`http://192.168.1.86:11000/Presets`);

  const xmlString = await response.text();
  const favorites = xmlString
    .split("\n")
    .filter((line) => line.includes("preset url="))
    .map((line) => {
      const urlMatch = line.match(/url="([^"]+)"/);
      const nameMatch = line.match(/name="([^"]+)"/);
      const imageMatch = line.match(/image="([^"]+)"/);
      const idMatch = line.match(/id="([^"]+)"/);

      return {
        url: urlMatch ? urlMatch[1] : "",
        title: nameMatch ? nameMatch[1] : "",
        image: imageMatch ? imageMatch[1] : "",
        id: idMatch ? idMatch[1] : "",
      };
    });

  return favorites;
};

export const getMusicStatus = async () => {
  const { status } = await getStateFromFetch("Status");

  // console.log({ status });

  return {
    status: status?.state,
    volume: status?.volume,
    title: status?.title1,
  };
};

const getStateFromFetch = async (slug: string): Promise<BluesoundResponse> => {
  const response = await fetch(`http://192.168.1.86:11000/${slug}`);

  const xmlString: string = (await response.text()).replaceAll("\n", "");

  const parser = new XMLParser();
  const xml = parser.parse(xmlString);

  return xml;
};
