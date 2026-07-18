import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPosts, findBlogPost } from "@/data/blogPosts";
import { Seo } from "@/components/shared/Seo";
import { AdSlot } from "@/components/shared/AdSlot";

export const Blog = () => (
  <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
    <Seo title="MTF Guides & Analysis" description="Practical, evidence-aware articles about MTF interest, break-even, charges and ledger interpretation." />
    <header className="border-b border-[#102A43] pb-7">
      <div className="kypnl-overline">MTF Journal</div>
      <h1 className="font-editorial text-4xl md:text-6xl mt-2">Understand leverage before using it.</h1>
      <p className="mt-4 max-w-2xl text-[#555]">Original explainers built around transparent formulas, tariff evidence and practical MTF decisions.</p>
    </header>
    <AdSlot id="blog-top" />
    <div className="grid md:grid-cols-3 border-t border-l border-[#102A43]">
      {blogPosts.map((post) => (
        <article key={post.slug} className="border-r border-b border-[#102A43] bg-white p-6">
          <div className="kypnl-overline">{post.readMinutes} min read · {post.publishedAt}</div>
          <h2 className="font-editorial text-2xl mt-3">{post.title}</h2>
          <p className="mt-3 text-sm text-[#555] leading-6">{post.description}</p>
          <Link className="mt-6 inline-flex items-center gap-2 text-sm font-medium" to={`/blog/${post.slug}`}>Read article <ArrowRight size={15} /></Link>
        </article>
      ))}
    </div>
  </main>
);

export const BlogArticle = () => {
  const { slug } = useParams();
  const post = findBlogPost(slug);
  if (!post) return <Navigate to="/blog" replace />;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.publishedAt, author: { "@type": "Organization", name: "KnowYourPNL" } };
  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <Seo title={post.title} description={post.description} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <Link to="/blog" className="text-sm underline underline-offset-4">← All articles</Link>
      <article>
        <header className="mt-7 border-b border-[#102A43] pb-7">
          <div className="kypnl-overline">{post.readMinutes} min read · Published {post.publishedAt}</div>
          <h1 className="font-editorial text-4xl md:text-6xl mt-3">{post.title}</h1>
          <p className="mt-4 text-lg text-[#555]">{post.description}</p>
        </header>
        {post.sections.map((section, index) => (
          <section key={section.heading} className="py-7 border-b border-[#d8d5cc]">
            <h2 className="font-editorial text-3xl">{section.heading}</h2>
            {section.paragraphs.map((p) => <p key={p} className="mt-4 leading-8 text-[#282824]">{p}</p>)}
            {index === 0 && <AdSlot id={`article-${post.slug}`} />}
          </section>
        ))}
        <p className="mt-8 border border-[#d8d5cc] bg-[#f1efe8] p-5 text-sm"><strong>Educational information only.</strong> Verify all tariffs with your broker and account records before making a financial decision.</p>
      </article>
    </main>
  );
};
