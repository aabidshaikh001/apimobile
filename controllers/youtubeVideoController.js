const Yotubevideo = require("../models/yotubeVideoModel");

exports.getVideoByPropertyId = async (req, res) => {
  try {
    const { id } = req.params;
    const videoData = await Yotubevideo.getByPropertyId(id);
    if (!videoData) {
      return res.status(404).json({ message: "No video found for this property." });
    }
    res.json(videoData);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.createOrUpdateVideo = async (req, res) => {
    try {
      const propertyId = req.params.id;
      const { video } = req.body;
  
      if (!video) {
        return res.status(400).json({ message: "Video URL is required." });
      }
  
      await Yotubevideo.upsert(propertyId, video);
      res.status(200).json({ message: "Video saved successfully." });
    } catch (error) {
      console.error("Error saving video:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    await Yotubevideo.deleteByPropertyId(id);
    res.status(200).json({ message: "Video deleted successfully." });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
