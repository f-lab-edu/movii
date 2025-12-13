const Spinner = () => {
  return (
    <div className="relative flex animate-spin rounded-full size-8">
      <div className="h-full w-1/2 rounded-l-full border-b-2 border-l-2 border-t-2 border-solid border-(--wp-gray50)" />
      <div className="h-full w-1/2 rounded-r-full border-b-2 border-r-2 border-t-2 border-solid border-(--color-disabled-text)" />
    </div>
  );
};

export default Spinner;
