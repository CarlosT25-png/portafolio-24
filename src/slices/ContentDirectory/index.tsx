import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ContentDirectory`.
 */
export type ContentDirectoryProps =
  SliceComponentProps<Content.ContentDirectorySlice>;

/**
 * Component for "ContentDirectory" Slices.
 */
const ContentDirectory = ({ slice }: ContentDirectoryProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for content_directory (variation: {slice.variation})
      Slices
    </section>
  );
};

export default ContentDirectory;
