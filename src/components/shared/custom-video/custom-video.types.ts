export type CustomVideoHandle = {
  seek: (time: number) => void;
  video: HTMLVideoElement | null;
};

export type CustomVideoProps = {
  src: string;
};