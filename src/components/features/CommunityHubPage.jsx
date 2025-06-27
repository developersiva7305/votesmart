import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, Send, ThumbsUp, Pin, UserCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CryptoJS from 'crypto-js';

const CommunityHubPage = ({ onBack, currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState({});

  const userHash = currentUser ? CryptoJS.SHA256(currentUser.id.toString()).toString(CryptoJS.enc.Hex) : 'anonymous';
  const isAdmin = currentUser && currentUser.role === 'admin';

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('communityHub_posts')) || [];
    setPosts(storedPosts.map(post => ({
      ...post,
      comments: post.comments || [], 
      likes: post.likes || 0 
    })));
  }, []);

  useEffect(() => {
    localStorage.setItem('communityHub_posts', JSON.stringify(posts));
  }, [posts]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post", description: "Cannot submit an empty post.", variant: "destructive" });
      return;
    }
    const newPost = {
      id: Date.now().toString(),
      userHash: userHash, 
      displayName: currentUser ? (currentUser.name || `User-${userHash.substring(0,6)}`) : 'Anonymous',
      content: newPostContent,
      createdAt: new Date().toISOString(),
      comments: [],
      likes: 0,
      isPinned: false,
      isAnswered: false,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostContent('');
    toast({ title: "Post Submitted!", description: "Your post is now live in the Community Hub." });
  };

  const handleCommentSubmit = (postId) => {
    if (!newCommentContent[postId] || !newCommentContent[postId].trim()) {
      toast({ title: "Empty Comment", description: "Cannot submit an empty comment.", variant: "destructive" });
      return;
    }
    const newComment = {
      id: Date.now().toString(),
      userHash: userHash,
      displayName: currentUser ? (currentUser.name || `User-${userHash.substring(0,6)}`) : 'Anonymous',
      content: newCommentContent[postId],
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));
    setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
    toast({ title: "Comment Added!", description: "Your comment has been added to the post." });
  };

  const handleLikePost = (postId) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
  };

  const handlePinPost = (postId) => {
    if (!isAdmin) return;
    setPosts(prevPosts => {
      const postToPin = prevPosts.find(p => p.id === postId);
      if (!postToPin) return prevPosts;
      const updatedPost = { ...postToPin, isPinned: !postToPin.isPinned };
      const otherPosts = prevPosts.filter(p => p.id !== postId);
      return updatedPost.isPinned ? [updatedPost, ...otherPosts] : [...otherPosts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).sort((a,b) => b.isPinned - a.isPinned);
    });
    toast({ title: "Post Pinned/Unpinned", description: "The post's pinned status has been updated." });
  };
  
  const handleMarkAnswered = (postId) => {
    if (!isAdmin) return;
     setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId ? { ...post, isAnswered: !post.isAnswered } : post
    ));
    toast({ title: "Post Answer Status Updated", description: "The post has been marked as answered/unanswered." });
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 dark:from-gray-900 dark:via-slate-800 dark:to-stone-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-3xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <MessageSquare className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Community Hub</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Ask questions, share comments, and engage with the community.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handlePostSubmit} className="space-y-3">
            <Textarea 
              placeholder="Share your thoughts or ask a question anonymously..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]"
            />
            <Button type="submit" className="w-full user-gradient">
              <Send className="mr-2 h-4 w-4" /> Post Anonymously
            </Button>
          </form>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {posts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).sort((a,b) => b.isPinned - a.isPinned).map(post => (
              <Card key={post.id} className={`dark:bg-gray-700/50 ${post.isPinned ? 'border-2 border-blue-500 dark:border-blue-400' : 'dark:border-gray-600'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg dark:text-gray-200">{post.displayName}</CardTitle>
                      <CardDescription className="text-xs dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleString()} {post.isPinned && <Pin className="inline h-4 w-4 ml-1 text-blue-500 dark:text-blue-400" />} {post.isAnswered && <UserCheck className="inline h-4 w-4 ml-1 text-green-500 dark:text-green-400" />}
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handlePinPost(post.id)} title={post.isPinned ? "Unpin Post" : "Pin Post"}>
                          <Pin className={`h-4 w-4 ${post.isPinned ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleMarkAnswered(post.id)} title={post.isAnswered ? "Mark as Unanswered" : "Mark as Answered"}>
                          <UserCheck className={`h-4 w-4 ${post.isAnswered ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleLikePost(post.id)} className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                      <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes} Likes
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="p-2 bg-gray-100 dark:bg-gray-600/50 rounded-md">
                        <p className="text-xs font-semibold dark:text-gray-300">{comment.displayName}</p>
                        <p className="text-xs dark:text-gray-400">{comment.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(post.id); }} className="mt-3 flex space-x-2">
                    <Input 
                      placeholder="Add a comment..."
                      value={newCommentContent[post.id] || ''}
                      onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    />
                    <Button type="submit" size="sm" variant="outline" className="dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">Comment</Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </motion.div>
  );
};

export default CommunityHubPage;