// Define a function to generate the MongoDB query object for searching listings
const generateSearchQuery = (searchQuery) => {
  // Find all listings in the database matching the search query
    // search listings  by title, country or location using regex
    //$or is  used to perform OR operation on an array of (3)sub-queries, atlist one match 
    //$regex is used to match  strings(searhQuery) anywhere within a string(title)
    // $options: 'i; is used to make pattern case-insenstive 
    //'.*' means that there can be anything before or after the letter it will match, '.*' pattern is used to match any character zero or more times,
    // like 't' letter match with 'match' word, because 'match' word have t word  inside it
  return {
    $or: [
      { title: { $regex: '.*' + searchQuery + '.*', $options: 'i' } },
      { country: { $regex: '.*' + searchQuery + '.*', $options: 'i' } },
      { location: { $regex: '.*' + searchQuery + '.*', $options: 'i' } }
    ]
  };
};

async function handleSearch(req, res, Listing) {
  const searchQuery = req.query.search;

  if (searchQuery) {
    const searchListings = generateSearchQuery(searchQuery);
    const allListings = await Listing.find(searchListings);
    return res.render("listings/index.ejs", { allListings });
  }
}

// Export the function to be used in other files
module.exports = { generateSearchQuery, handleSearch };
