import { XMLParser } from "fast-xml-parser";

export const playMusic = async () => {
  const { state } = await getStateFromFetch("Play");

  return state;
};

export const pauseMusic = async () => {
  const { state } = await getStateFromFetch("Pause");

  return state;
};

export const getMusicStatus = async () => {
  const { status } = await getStateFromFetch("Status");

  return { status: status.state, volume: status.volume };
};

const getStateFromFetch = async (slug: string): Promise<any> => {
  const response = await fetch(`http://192.168.1.86:11000/${slug}`);

  const xmlString: string = (await response.text()).replaceAll("\n", "");

  const parser = new XMLParser();
  const xml = parser.parse(xmlString);

  return xml;
};
