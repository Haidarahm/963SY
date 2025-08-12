const LoadingDots = () => {
    return (
      <div className="flex justify-center items-center space-x-2 h-16 ltr">
        <div className="w-3 h-3 rounded-full animate-bounce bg-[#F26A1B] [animation-delay:-0.3s]" />
        <div className="w-3 h-3 rounded-full animate-bounce bg-[#F26A1B] [animation-delay:-0.15s]" />
        <div className="w-3 h-3 rounded-full animate-bounce bg-[#F26A1B]" />
      </div>
    );
  };

  export default LoadingDots;
