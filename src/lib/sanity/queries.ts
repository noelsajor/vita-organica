import groq from "groq";

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    publishedAt,
    mainImage,
    body,
    "author": author->name,
    "categories": categories[]->title,
    "seo": {
      "title": seoTitle,
      "description": seoDescription
    }
  }
`;

export const allSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;
