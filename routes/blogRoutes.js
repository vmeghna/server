import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogsbyId,
  updateBlogById,
  deleteBlogById,
  addCommentToBlog,
  deleteCommentById,
  updateCommentById,
  updateLikesForBlog,
} from "../controllers/blogController.js";

const router = express.Router();
// createBlog
router.post("/", createBlog);

//getBlogs
router.get("/", getBlogs);

//getBlogbyId
router.get("/:id", getBlogsbyId);

//updateBlogById
router.put("/:id", updateBlogById);

//DeleteBlogById
router.delete("/:id", deleteBlogById);

//for adding comments
router.post("/:id/comments", addCommentToBlog);

//for deleting comment
router.delete("/:blogId/comments/:commentId", deleteCommentById);

//for update comment
router.put("/:blogId/comments/:commentId", updateCommentById);

//update likes
router.put("/:id/likes", updateLikesForBlog);

export default router;
