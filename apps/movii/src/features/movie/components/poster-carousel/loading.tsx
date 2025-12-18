const PosterCarouselLoading = () => {
  return (
    <ul className="flex gap-3">
      {[...Array(8)].map((_, index) => (
        <li
          key={index}
          className="size-full animate-pulse bg-(--color-background30) aspect-2/3 rounded-md mb-2"
        />
      ))}
    </ul>
  );
};

export default PosterCarouselLoading;
