const router = require("express").Router();
router.get('/api/search', async (req, res) => {
    try {
      const { query, fileType, page } = req.query;
      const pageSize = 10; // Number of results per page
      const currentPage = parseInt(page) || 1;
  
      let searchQuery = { title: { $regex: query, $options: 'i' } };
  
      if (fileType) {
        searchQuery.type = fileType; // Add file type filter to the search query
      }
  
      const totalDocumentsCount = await File.countDocuments(searchQuery).exec();
      const totalPages = Math.ceil(totalDocumentsCount / pageSize);
  
      const searchResults = await File.find(searchQuery)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .exec();
  
      res.status(200).json({ results: searchResults, totalPages });
    } catch (error) {
      res.status(500).json({ message: 'Error searching documents', error });
    }
  });
  