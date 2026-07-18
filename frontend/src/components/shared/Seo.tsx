import { useEffect } from "react";

export const Seo = ({ title, description }: { title: string; description: string }) => {
  useEffect(() => {
    document.title = `${title} | KnowYourPNL`;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
  return null;
};
