import 'vditor/dist/index.css';
import { generateUUID } from '../utils';

const Preview = ({ value }: { value: string }) => {
  const id = generateUUID();
  return <div id={`preview-${id}`} className="ndzy-preview" dangerouslySetInnerHTML={{ __html: value }} />;
};
export default Preview;
