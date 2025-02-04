const Favorite = ({
  title,
  handlePlayFavorite,
  favorite,
}: {
  title: string;
  handlePlayFavorite: (favorite: any) => void;
  favorite: any;
}) => {
  const handleClick = () => {
    handlePlayFavorite(favorite);
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      {title}
      <button onClick={handleClick} className="ml-auto flex-grow-1">
        Play Favorite
      </button>
    </div>
  );
};

export default Favorite;
