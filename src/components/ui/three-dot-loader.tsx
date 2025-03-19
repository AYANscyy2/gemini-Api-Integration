export const ThreeDotsLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-3">
        <span className="text-gray-300">loading response...</span>
        <div className="flex justify-center items-center space-x-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
        </div>
      </div>
    </div>
  );
};
