export type TmdbImageKind = 'backdrop' | 'logo' | 'poster' | 'profile' | 'still';
export type TmdbSizeToken = 'original' | `${'w' | 'h'}${number}`;
export type TmdbImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcSet' | 'width' | 'height'
> & {
  kind: TmdbImageKind;
  path: string; // "/wigZBAmNrIhxp2FNGOROUAeHvdh.jpg"
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};
