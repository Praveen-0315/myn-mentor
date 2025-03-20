import { useEffect, useState } from 'react';
import { encode } from 'plantuml-encoder';

interface PlantUMLRendererProps {
  content: string;
  title?: string;
  className?: string;
}

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml';

const PlantUMLRenderer = ({ content, title, className }: PlantUMLRendererProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      // Encode the PlantUML content
      const encodedDiagram = encode(content);
      // Generate the URL for the rendered diagram
      const url = `${PLANTUML_SERVER}/svg/${encodedDiagram}`;
      setImageUrl(url);
      setError('');
    } catch (err) {
      console.error('Error encoding PlantUML:', err);
      setError('Failed to render diagram');
    }
  }, [content]);

  if (error) {
    return (
      <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium mb-2">{title}</h4>
      )}
      {imageUrl && (
        <div className="border rounded-lg p-4 bg-white">
          <img 
            src={imageUrl} 
            alt={title || 'PlantUML Diagram'} 
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default PlantUMLRenderer; 