function LoadingAnimation({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-md mx-auto mt-6" data-testid="loading-animation">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-4 transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm mt-2 text-gray-600 font-medium">
        {progress}% carregado...
      </p>
    </div>
  );
}

export default LoadingAnimation;
