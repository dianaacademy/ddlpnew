import { useState, useEffect } from 'react';
import { getDatabase, ref, get, set, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkeletonCard } from './components/skeltoncard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [uploadError, setUploadError] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => { 
      setIsLoading(true);
      try {
        const database = getDatabase();
        const documentsRef = ref(database, 'documents');
       
        const instructorsRef = ref(database, 'instructor');
        const [documentsSnapshot, instructorsSnapshot] = await Promise.all([
          get(documentsRef),
          get(instructorsRef),
        ]);

        const documentsData = documentsSnapshot.val();
        const instructorsData = instructorsSnapshot.val();

        if (documentsData) {
          const documentsList = Object.entries(documentsData).map(([docId, docData], index) => ({
            serialNo: index + 1,
            title: docData.title,
            author: docData.author,
            date: docData.date,
            instructor: docData.instructor || 'Unassigned',
            docId,
          }));
          setDocuments(documentsList);
          setFilteredDocuments(documentsList);
        }

        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val();

        if (usersData) {
            const instructorData = Object.values(usersData).filter(user => user.role === 'instructor');

          setInstructors(instructorData);
          console.log(instructors);
        } else {
          console.warn('No instructors found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: 'Error fetching data', status: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const result = documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(result);
  }, [searchTerm, documents]);

  const handleDelete = async (docId) => {
    try {
      const database = getDatabase();
      const documentRef = ref(database, `documents/${docId}`);
      await remove(documentRef);
      setDocuments(documents.filter((doc) => doc.docId !== docId));
      setConfirmDelete(null);
      toast({ title: 'Document deleted successfully', status: 'success' });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({ title: 'Failed to delete document', status: 'error' });
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedInstructor) {
      setUploadError('Please select a file and an instructor.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size exceeds 2MB limit.');
      return;
    }

    try {
      const database = getDatabase();
      const docId = Date.now().toString();
      const newDocument = {
        title: file.name,
        author: 'Admin',
        date: new Date().toLocaleDateString(),
        instructor: selectedInstructor,
      };

      const documentRef = ref(database, `documents/${docId}`);
      await set(documentRef, newDocument);

      setDocuments([
        ...documents,
        { ...newDocument, docId, serialNo: documents.length + 1 },
      ]);
      setFile(null);
      setSelectedInstructor('');
      setUploadError('');
      toast({ title: 'Document uploaded successfully', status: 'success' });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({ title: 'Failed to upload document', status: 'error' });
    }
  };

  const handleEdit = (docId) => {
    navigate(`/edit-document/${docId}`);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div>
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Documents</CardTitle>
                <div className="mb-4 text-black">
                  <Input
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 w-[400px] my-2 border rounded mr-2"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full rounded-lg shadow-md">
                  <thead>
                    <tr className="text-black">
                      <th className="py-3 px-4 text-left">Serial No.</th>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Author</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Instructor</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.docId} className="hover:bg-gray-100">
                        <td className="py-3 px-4 border-b border-gray-300">{doc.serialNo}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{doc.title}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{doc.author}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{doc.date}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{doc.instructor}</td>
                        <td className="border-b border-gray-300">
                          <Button
                            className="ml-2"
                            variant="outline"
                            onClick={() => handleEdit(doc.docId)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="ml-2"
                            variant="outline"
                            onClick={() => setConfirmDelete(doc.docId)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold">Upload Document</h3>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="my-2"
                />
               <Select onValueChange={setSelectedInstructor}>
  <SelectTrigger className="my-2">
    <SelectValue placeholder="Assign to Instructor" />
  </SelectTrigger>
  <SelectContent>
  {instructors.length > 0 ? (
    instructors.map((instructor) => (
      <SelectItem key={instructor.email} value={instructor.email}>
        {instructor.name}
      </SelectItem>
    ))
  ) : (
    <SelectItem value="no-instructors" disabled>
      No instructors available
    </SelectItem>
  )}
</SelectContent>
</Select>
                {uploadError && <p className="text-red-500">{uploadError}</p>}
                <Button onClick={handleUpload} className="mt-4">
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Documents;
