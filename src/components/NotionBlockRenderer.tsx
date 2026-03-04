import React from 'react';

type RichTextItem = {
  plain_text: string;
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
};

type Block = {
  id: string;
  type: string;
  [key: string]: any;
};

function renderRichText(richText: RichTextItem[]) {
  return richText.map((text, index) => {
    let element = <span key={index}>{text.plain_text}</span>;
    if (text.annotations?.bold) element = <strong key={index}>{text.plain_text}</strong>;
    if (text.annotations?.italic) element = <em key={index}>{text.plain_text}</em>;
    if (text.annotations?.underline) element = <u key={index}>{text.plain_text}</u>;
    if (text.annotations?.code) element = <code key={index}>{text.plain_text}</code>;
    return element;
  });
}

export default function NotionBlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-6 leading-relaxed text-gray-800">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );
    case 'heading_1':
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4 font-serif">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold mt-6 mb-3 font-serif">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 className="text-xl font-bold mt-5 mb-2 font-serif">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li className="ml-6 list-disc">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li className="ml-6 list-decimal">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );
    case 'image': {
      const imageUrl = block.image.file?.url || block.image.external?.url;
      if (!imageUrl) return null;

      return (
        <div className="my-8">
          <img
            src={imageUrl}
            alt={block.image.caption?.[0]?.plain_text || 'Immagine articolo'}
            className="rounded-lg shadow-md mx-auto"
            loading="lazy"
          />
        </div>
      );
    }
    default:
      return null;
  }
}