import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { db, storage } from '../../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "@/auth/hooks/useauth";

const CreatePostPage = () => {
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hashtag, setHashtag] = useState('');
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();

  const addHashtag = () => {
    const trimmedHashtag = hashtag.trim();
    if (trimmedHashtag && !tags.includes(`#${trimmedHashtag}`)) {
      setTags([...tags, `#${trimmedHashtag}`]);
      setHashtag('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postContent.trim()) {
      toast.error('Post content cannot be empty!');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to create a post');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `posts/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

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

      const postData = {
        post_content: postContent,
        post_by_uid: currentUser.uid,
        post_by: currentUser.displayName || 'Anonymous', 
        post_by_profile_URL: currentUser.photoURL || 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/images%2FLogo.webp_1713805913651?alt=media&token=012eb4a3-d9f4-4049-9d58-af07a86175f5', 
        post_time: serverTimestamp(),
        post_like: 0,
        post_reply: 0,
        post_image: imageUrl || '',
        tags: tags, // Add tags to post data
      };

      await addDoc(collection(db, 'post_diana'), postData);

      toast.success('Post created successfully!');
      setPostContent('');
      setImageFile(null);
      setTags([]); // Clear tags after successful post
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
            
            {/* Hashtag Input Section */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add a hashtag"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addHashtag}
              >
                Add Hashtag
              </Button>
            </div>

            {/* Displayed Hashtags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <X 
                      className="ml-2 h-4 w-4 cursor-pointer" 
                      onClick={() => removeHashtag(tag)}
                    />
                  </div>
                ))}
              </div>
            )}

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