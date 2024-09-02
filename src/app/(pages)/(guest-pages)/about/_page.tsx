import Link from "next/link";
import React from "react";
import { truncateStr } from "@/lib/utils";

const Blog = () => {
  return (
    <div className="mx-4 flex flex-wrap">
      {/* Blogposts */}
      {blogPosts.map(({ image, date, title, content }, i) => (
        <div key={i} className="md:w-1/2 lg:w-1/3 p-4">
          <BlogCard
            image={image}
            date={date}
            cardTitle={title}
            cardDescription={truncateStr(content, 80)}
          />
        </div>
      ))}
    </div>
  );
};

export default Blog;

const BlogCard = ({
  image,
  date,
  cardTitle,
  cardDescription,
}: {
  image: string;
  date: string;
  cardTitle: string;
  cardDescription: string;
}) => {
  return (
    <Link
      href="/blog"
      id="blogpostCard"
      className="block w-full p-4 bg-card rounded hover:bg-popover cursor-pointer h-fit"
    >
      <div className="mb-8 w-full">
        <div className="mb-8 overflow-hidden rounded">
          <img src={image} alt="" className="w-full" />
        </div>
        <div className="flex flex-col">
          {date && (
            <span className="inline-block opacity-50 text-xs font-semibold leading-loose">
              {date}
            </span>
          )}
          <h3 className="mb-2 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl">
            {cardTitle}
          </h3>
          <p className="text-sm">{cardDescription}</p>
        </div>
      </div>
    </Link>
  );
};

const blogPosts = [
  {
    date: "Dec 22, 2023",
    title: "Meet AutoManage, the best AI management tools",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://placehold.co/600x400",
  },
  {
    date: "Dec 22, 2023",
    title: "Meet AutoManage, the best AI management tools",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://placehold.co/600x400",
  },
  {
    date: "Dec 22, 2023",
    title: "Meet AutoManage, the best AI management tools",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://placehold.co/600x400",
  },
];
