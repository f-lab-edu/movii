const ResultLoading = () => {
  return (
    <ul className="pt-[22px]">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="flex items-center gap-3.5 py-2 animate-pulse">
          <div className="size-12 bg-(--color-background30) rounded-md" />
          <div className="flex flex-col gap-2">
            <div className="w-[200px] h-5 bg-(--color-background30) rounded-md" />
            <div className="w-[100px] h-4 bg-(--color-background30) rounded-md" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ResultLoading;
