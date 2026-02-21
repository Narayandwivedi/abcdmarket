import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [originalQuery, setOriginalQuery] = useState('') // Store the user's original input
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const navigate = useNavigate()


  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setOriginalQuery(query) // Store the user's original input
    setSelectedSuggestionIndex(-1) // Reset selection when typing
    
    if (query.length > 0) {
      const queryLower = query.toLowerCase().trim();
      
      // Smart filtering with priority system
      const suggestions = searchSuggestions.map(suggestion => {
        const suggestionLower = suggestion.toLowerCase();
        let score = 0;
        let matches = false;

        // Highest priority: exact phrase match
        if (suggestionLower.includes(queryLower)) {
          matches = true;
          // Higher score for suggestions that start with the query
          if (suggestionLower.startsWith(queryLower)) {
            score = 100;
          } else {
            score = 80;
          }
        }
        
        // Medium priority: all words match in order
        const queryWords = queryLower.split(' ').filter(word => word.length > 1);
        if (queryWords.length > 1) {
          let allWordsMatch = true;
          let wordIndex = 0;
          
          for (const queryWord of queryWords) {
            const remainingSuggestion = suggestionLower.slice(wordIndex);
            const wordPosition = remainingSuggestion.indexOf(queryWord);
            
            if (wordPosition === -1) {
              allWordsMatch = false;
              break;
            }
            wordIndex += wordPosition + queryWord.length;
          }
          
          if (allWordsMatch && !matches) {
            matches = true;
            score = 60;
          }
        }
        
        // Lower priority: individual word matching
        if (!matches && queryWords.length > 0) {
          const suggestionWords = suggestionLower.split(' ');
          let matchingWords = 0;
          
          queryWords.forEach(queryWord => {
            if (suggestionWords.some(suggestionWord => 
              suggestionWord.startsWith(queryWord) || 
              suggestionWord.includes(queryWord)
            )) {
              matchingWords++;
            }
          });
          
          if (matchingWords > 0) {
            matches = true;
            // Score based on percentage of matching words
            score = (matchingWords / queryWords.length) * 40;
          }
        }

        return { suggestion, score, matches };
      })
      .filter(item => item.matches)
      .sort((a, b) => b.score - a.score)
      .map(item => item.suggestion)
      .slice(0, 10); // Show max 10 suggestions like Amazon

      const filteredSuggestions = suggestions;
      
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setOriginalQuery(suggestion) // Update original query so it doesn't get restored on blur
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    // Don't automatically search, just set the text in the input
    // User can then press Enter or click search button
  }

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      // Clear the search query after navigation
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
      return
    }

    if (!showSuggestions || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0
        setSelectedSuggestionIndex(nextIndex)
        // Immediately update the search input with the selected suggestion
        setSearchQuery(suggestions[nextIndex])
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1
        setSelectedSuggestionIndex(prevIndex)
        // Immediately update the search input with the selected suggestion
        setSearchQuery(suggestions[prevIndex])
        break
      case 'Escape':
        e.preventDefault()
        // Restore original query when escaping
        setSearchQuery(originalQuery)
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
      default:
        break
    }
  }

  const handleFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      // If no suggestion was clicked, restore original query
      if (selectedSuggestionIndex >= 0) {
        setSearchQuery(originalQuery)
      }
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }, 200)
  }

  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search onions, fruits, gold ..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full pl-9 sm:pl-10 pr-14 sm:pr-20 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 right-0 pr-1.5 sm:pr-3 flex items-center">
              <button
                onClick={() => handleSearch()}
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-amber-950 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-200 flex items-center justify-center font-semibold shadow-[0_4px_10px_rgba(180,83,9,0.28)]"
              >
                {/* Mobile: Show only search icon */}
                <svg className="w-3.5 h-3.5 sm:hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                {/* Desktop: Show text */}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === selectedSuggestionIndex 
                      ? 'bg-amber-50 text-amber-900' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className={`h-4 w-4 ${
                      index === selectedSuggestionIndex ? 'text-amber-500' : 'text-gray-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <span>{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SearchBar
