import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

export const Guides = () => (
  <main className="mx-auto max-w-7xl px-4 md:px-6 py-10">
    <header className="border-b border-[#102A43] pb-6 mb-10">
      <div className="kypnl-overline">Published guides</div>
      <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Read before you leverage.</h1>
      <p className="text-sm text-[#486581] max-w-3xl mt-3">Original explanations connected to the formulas and evidence used across KnowYourPNL.</p>
    </header>
    <ul className="grid md:grid-cols-2 border border-[#102A43] bg-white">
      {blogPosts.map((guide, index) => (
        <li key={guide.slug} className={`p-5 flex gap-3 border-[#e5e5df] ${index % 2 ? "md:border-l" : ""} ${index >= 2 ? "border-t" : ""}`}>
          <BookOpen size={16} className="mt-1 text-[#087F6D]" />
          <div><Link to={`/blog/${guide.slug}`} className="font-editorial text-xl font-semibold hover:underline">{guide.title}</Link><p className="mt-2 text-sm text-[#555]">{guide.description}</p><div className="kypnl-overline mt-3">{guide.readMinutes} min read · Published</div></div>
        </li>
      ))}
    </ul>
  </main>
);
