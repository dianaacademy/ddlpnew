import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
function TextContainer({chapterDetails, handleChapterDetailsChange }) {

    return (
      <div>
        <ReactQuill
          name="content"
          theme="snow"  // Specify theme ('snow' or 'bubble')
          value={chapterDetails.content || ""}
          onChange={handleChapterDetailsChange}
        />
      </div>
    );
  }
  
  export default TextContainer;
  
