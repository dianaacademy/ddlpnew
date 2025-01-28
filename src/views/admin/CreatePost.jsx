import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { db, storage } from '../../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';

const CreatePostPage = () => {
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) {
      toast.error('Post content cannot be empty!');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `posts/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(imageUrl);
            }
          );
        });
      }

      // Add post to Firestore
      const postData = {
        post_content: postContent,
        post_by: 'Diana ATA', 
        post_by_profile_URL: 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/images%2FLogo.webp_1713805913651?alt=media&token=012eb4a3-d9f4-4049-9d58-af07a86175f5', 
        post_time: serverTimestamp(),
        post_like: 0,
        post_reply: 0,
        post_image: imageUrl || '',
      };

      await addDoc(collection(db, 'post_diana'), postData);

      toast.success('Post created successfully!');
      setPostContent('');
      setImageFile(null);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="min-h-[150px]"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? 'Posting...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostPage;