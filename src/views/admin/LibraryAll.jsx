import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { db, storage } from '../../firebase.config';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "@/auth/hooks/useauth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AssignBookUP from './LibraryEnroll';

const BooksPage = () => {
  const [activeTab, setActiveTab] = useState('Add Books');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookCategory, setBookCategory] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const { currentUser } = useAuth();

  // Fetch all books from Firestore
  const fetchBooks = async () => {
    const querySnapshot = await getDocs(collection(db, 'books_db'));
    const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBooks(booksData);
  };

  // Handle adding a new book
  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!bookName || !bookDescription || !bookCategory || !thumbnailFile || !pdfFile) {
      toast.error('All fields are required!');
      return;
    }

    setIsLoading(true);

    try {
      // Upload thumbnail
      const thumbnailRef = ref(storage, `books/thumbnails/${thumbnailFile.name}`);
      const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnailFile);
      const thumbnailUrl = await new Promise((resolve, reject) => {
        thumbnailUploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => resolve(await getDownloadURL(thumbnailUploadTask.snapshot.ref))
        );
      });

      // Upload PDF
      const pdfRef = ref(storage, `books/pdfs/${pdfFile.name}`);
      const pdfUploadTask = uploadBytesResumable(pdfRef, pdfFile);
      const pdfUrl = await new Promise((resolve, reject) => {
        pdfUploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => resolve(await getDownloadURL(pdfUploadTask.snapshot.ref))
        );
      });

      // Add book to Firestore
      const bookData = {
        bookName,
        bookDescription,
        bookCategory,
        thumbnailUrl,
        pdfUrl,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'books_db'), bookData);

      toast.success('Book added successfully!');
      setBookName('');
      setBookDescription('');
      setBookCategory('');
      setThumbnailFile(null);
      setPdfFile(null);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a book
  const handleEditBook = async (bookId, updatedData) => {
    try {
      await updateDoc(doc(db, 'books_db', bookId), updatedData);
      toast.success('Book updated successfully!');
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <div className="flex space-x-4 mb-6">
        {['Add Books', 'All Books'].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === 'Add Books' && (
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Add a New Book</h1>
          <form onSubmit={handleAddBook} className="space-y-4">
            <Input
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
            <Textarea
              placeholder="Book Description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <Select onValueChange={setBookCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Level One">Level One</SelectItem>
                <SelectItem value="Level Two">Level Two</SelectItem>
                <SelectItem value="Level Three">Level Three</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Adding...' : 'Add Book'}
            </Button>
          </form>
        </Card>
      )}

      {activeTab === 'All Books' && (
        <div className="space-y-4">
          <AssignBookUP/>
        </div>
      )}
    </div>
  );
};

export default BooksPage;