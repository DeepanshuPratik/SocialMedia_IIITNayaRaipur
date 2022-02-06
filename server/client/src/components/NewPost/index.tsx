import { AxiosError, AxiosRequestHeaders } from 'axios';
import { ReactText, useEffect, useRef, useState } from 'react';
import { apiPost } from '../../helpers/apiRequest';
import { useMyProfileContext } from '../../hooks/useMyProfileContext';
import PostByUserResponse from '../../types/response/PostsByUserResponse';
import { toast } from 'react-toastify';
import { type } from 'os';
import { useNavigate } from 'react-router-dom';

interface Props {}
const NewPost: React.FC<Props> = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { state: userData, dispatch } = useMyProfileContext();
  const inputRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastId = useRef<ReactText | null>(null);
  const nav = useNavigate();
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const text = inputRef.current?.innerHTML;
    if (text && text !== '') {
      const request = new FormData();
      if (fileRef.current && fileRef.current.files)
        request.append('file', fileRef.current?.files[0]);
      if (inputRef.current && inputRef.current.textContent)
        request.append('caption', inputRef.current.textContent);
      setIsUploading(true);
      try {
        let headers: AxiosRequestHeaders = {};
        const [res, code] = await apiPost<FormData, PostByUserResponse>(
          '/api/post/create',
          request,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (p) => {
              const progress = p.loaded / p.total;
              if (toastId.current === null) {
                toastId.current = toast('Upload in Progress', {
                  progress: progress,
                  autoClose: 5000,
                });
              } else {
                toast.update(toastId.current, {
                  progress: progress,
                });
              }
            },
          },
        );
        console.log(res);
        setIsUploading(false);
        if (code >= 200 && code < 300) {
          toast.update(toastId.current as ReactText, {
            render: 'Uploaded Successfully',
            type: 'success',
          });
          dispatch({ type: 'new-post', payload: res as PostByUserResponse });
        }
      } catch (err) {
        const error = err as AxiosError;
        console.log(err, error.response);
        setIsUploading(false);
        if (fileRef.current) fileRef.current.value = '';
        toast.update(toastId.current as ReactText, {
          render: 'Upload Failed',
          type: 'error',
        });
      }
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      if (isUploading) inputRef.current.contentEditable = 'false';
      else {
        inputRef.current.contentEditable = 'true';
        inputRef.current.innerHTML = '';
      }
    }
  }, [isUploading]);
  return (
    <div
      className="flex  
      border-2 border-hints dark:border-d-hints 
      p-4 rounded-lg my-px h-32 gap-5  items-center w-full"
      style={{ minHeight: '8rem' }}
    >
      <button
        className="rounded-full object-cover w-16 overflow-hidden bg-background_variant dark:bg-d-background_variant"
        onClick={() => {
          nav('profile');
        }}
      >
        <img src={`${userData?.profile?.photoUrl}`} alt="" className="w-full" />
      </button>
      <form
        className=" flex relative h-full w-full rounded-md overflow-hidden"
        action=""
      >
        <div
          className="bg-background_variant dark:bg-d-background_variant h-full w-full 
		   p-3 text-sm "
          placeholder="Write somethinig to share..."
          ref={inputRef}
          contentEditable
        />
        <div
          className="absolute flex gap-4 justify-between items-center bottom-2 
		right-2 origin-bottom-right"
        >
          <div className="flex gap-2 justify-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <img
                src="/assets/attatch-image.svg"
                alt="Attatch image"
                className="w-4 dark:invert"
              />
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".jpg, .jpeg, .png, .svg, .gif"
              ref={fileRef}
            />
          </div>
          <button
            className="btn px-2 py-0 h-5"
            type="submit"
            onClick={handleSubmit}
          >
            {isUploading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewPost;
