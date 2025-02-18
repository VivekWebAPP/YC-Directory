'use client';
import React, { useActionState, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { fromSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/action';


const StartUpForm = () => {
    const [error, seterror] = useState<Record<string, string>>({});
    const [pitch, setPitch] = React.useState("");
    const { toast } = useToast();
    const router = useRouter();
    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValue = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                link: formData.get('link') as string,
                pitch,
            }

            await fromSchema.parseAsync(formValue);

            console.log(formValue);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status == "SUCCESS") {
                toast({
                    title: 'Success',
                    description: 'Your startup has been submitted successfully',
                });

                router.push(`/startup/${result._id}`);
            }
            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldError = error.flatten().fieldErrors;
                seterror(fieldError as unknown as Record<string, string>);
                toast({
                    title: 'Error',
                    description: 'Please check your input and try again',
                    variant: 'destructive',
                });
                return { ...prevState, error: "Validation Failed", status: "ERROR" }
            }
            toast({
                title: 'Error',
                description: 'An Unexpected error has occurred',
                variant: 'destructive',
            });
            return { ...prevState, error: "An Unexpected error has occurred", status: "ERROR" };
        }
    }
    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: 'INITIAL' });

    return (
        <>
            <form action={formAction} className='startup-form'>
                <div className=''>
                    <label htmlFor="title" className='startup-form_label'>Title</label>
                    <Input className='startup-form_input' id='title' name='title' required placeholder='Start Up Title'></Input>
                    {error.title && <p className='startup-form_error'>{error.title}</p>}
                </div>
                <div className=''>
                    <label htmlFor="description" className='startup-form_label'>Description</label>
                    <Textarea className='startup-form_textarea' id='description' name='description' required placeholder='Start Up Description'></Textarea>
                    {error.description && <p className='startup-form_error'>{error.description}</p>}
                </div>
                <div className=''>
                    <label htmlFor="category" className='startup-form_label'>Category</label>
                    <Input className='startup-form_input' id='category' name='category' required placeholder='Start Up Category (Eg: Tech,Eduction)'></Input>
                    {error.category && <p className='startup-form_error'>{error.category}</p>}
                </div>
                <div className=''>
                    <label htmlFor="link" className='startup-form_label'>Image Link</label>
                    <Input className='startup-form_input' id='link' name='link' required placeholder='Start Up Image URL'></Input>
                    {error.link && <p className='startup-form_error'>{error.link}</p>}
                </div>
                <div data-color-mode="light">
                    <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
                    <MDEditor
                        value={pitch}
                        onChange={(e) => setPitch(e as string)}
                        preview='edit'
                        height={300}
                        style={{ borderRadius: 20, overflow: "hidden" }}
                        textareaProps={{
                            placeholder: 'Briefly describe your idea and what problem it is solving'
                        }}
                        previewOptions={{
                            disallowedElements: ['style']
                        }}
                    />
                    {error.title && <p className='startup-form_error'>{error.title}</p>}
                </div>
                <Button type='submit' disabled={isPending} className='startup-form_btn text-white'>{isPending ? 'Submitting...' : 'Submit your pitch'}
                    <Send className='size-6 ml-2' />
                </Button>
            </form>
        </>
    )
}

export default StartUpForm