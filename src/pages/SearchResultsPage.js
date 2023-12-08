import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const type = searchParams.get('type');

  // Fetch or filter the search results based on searchQuery and mediaType
  // ...

  return (
    <div>
      {/* Render the search results here */}
      Search results for "{query}" in "{type}"
    </div>
  );
};

export default SearchResultsPage;
