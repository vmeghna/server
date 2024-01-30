import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      name: String,
      title: String,
      subtitle: String,
      content: String,
      tags: String,
      // likes: [
      //   {
      //     liked: { type: Number, default: 0 },
      //     isLiked: { type: Boolean, default: false },
      //   },
      // ],
      likes: Number,
      imageUrl: String,
      comments: [
        {
          text: String,
          name: String,
          date: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const BlogModel = mongoose.model("posts", blogSchema);

export default BlogModel;
