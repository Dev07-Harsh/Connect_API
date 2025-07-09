import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = () => {
    if (query.trim()) onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="mt-20 px-4 w-full flex flex-col items-center">
      {/* Search Input and Button Container */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search Input */}
        <div className="flex flex-1 items-center bg-white/10 backdrop-blur-md rounded-2xl border transition-all duration-300 px-3 py-2 sm:py-3 border-white/20 focus-within:border-purple-400 focus-within:shadow-lg focus-within:shadow-purple-500/25">
          <svg
            className={`w-5 h-5 mr-2 ${isFocused ? "text-purple-400" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search for APIs, services, or endpoints..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {query && (
            <button onClick={clearSearch} className="text-gray-400 hover:text-white transition">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-center sm:block">
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className={`
              px-4 sm:px-6 
              py-3 sm:py-3 
              w-[140px] sm:w-auto
              text-sm sm:text-base
              rounded-xl font-semibold transition duration-300 transform
              ${
                query.trim()
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-lg shadow-purple-500/25"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isTyping ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Quick Search Tags */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {["Payment APIs", "Social Media", "Weather", "Maps", "AI/ML"].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag);
              onSearch(tag);
            }}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:border-purple-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
