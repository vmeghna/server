import BlogModel from "../Models/blogModel.js";
import UsersModel from "../Models/Users.js";
import mongoose from "mongoose";

//CreateBlog
export const createBlog = async (req, res) => {
  try {
    const { author, title, subtitle, content, tags, imageUrl } = req.body;
    const newBlog = new BlogModel({
      author: {
        name: author.name,
        title,
        subtitle,
        content,
        tags,
        imageUrl,
        likes: 0,
        // likes: [{ liked: 0, isLiked: false }],
      },
    });

    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get All blogs

export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error getting blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get by id
export const getBlogsbyId = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.json({
      _id: blog._id,
      title: blog.author.title,
      subtitle: blog.author.subtitle,
      content: blog.author.content,
      tags: blog.author.tags.split(","),
      likes: blog.author.likes,
      // likes: blog.author.likes.map((like) => ({
      //   liked: like.liked,
      //   isLiked: like.isLiked,
      // })),
      imageUrl: blog.author.imageUrl,
      author: {
        name: blog.author.name,
      },
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      comments: blog.author.comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//DeleteBlogById

export const deleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//for adding comments

// Add comment to a blog post
export const addCommentToBlog = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const { name } = req.body;
  console.log(req.body);

  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        $push: {
          "author.comments": { text, name },
        },
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete comment of a blog
export const deleteCommentById = async (req, res) => {
  const { blogId, commentId } = req.params;

  try {
    console.log("Deleting comment:", commentId, "from blog:", blogId);

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          "author.comments": { _id: commentId },
        },
      },
      { new: true }
    );

    console.log("Updated Blog after deletion:", updatedBlog);

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//updateComment
export const updateCommentById = async (req, res) => {
  const { blogId, commentId } = req.params;
  const { text, name } = req.body;

  try {
    const updatedBlog = await BlogModel.findOneAndUpdate(
      { _id: blogId, "author.comments._id": commentId },
      {
        $set: {
          "author.comments.$.text": text,
          "author.comments.$.name": name,
        },
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog or comment not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update likes

export const updateLikesForBlog = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { $set: { "author.likes": likes } },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
