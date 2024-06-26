import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content, DateField, isFilled } from "@prismicio/client";
import Button from "./Button";


export default async function ContentBody({ page }: { page: Content.BlogPostDocument | Content.ProjectDocument }) {
  function formatDate(date: DateField) {
    if (isFilled.date(date)) {
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date))
    }
  }

  const formattedDate = formatDate(page.data.date_posted)

  return (
    <Bounded>
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        {page.type === "blog_post" && (
          <>
            <div className="flex gap-4 text-yellow-400 text-xl font-bold">
              {page.tags.map((tag, idx) => {
                return <span key={idx}>{tag}</span>;
              })}
            </div>
            <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">{formattedDate}</p>
          </>
        )}
        {page.type === 'project' && (
          <div className="flex space-between items-center border-b border-slate-600 pb-4 mt-3">
            <p className="text-xl font-medium text-slate-300 leading-none">{formattedDate}</p>
            {isFilled.link(page.data.project_url) && (
              <Button label={'View Project'} linkField={page.data.project_url} className="ml-auto" />
            )}
          </div>
        )}
        
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}
