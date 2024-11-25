'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

const suggestionFormSchema = z.object({
  message: z.string().max(500),
  wikipediaLink: z.string().max(75).or(z.literal('')),
});

export function SuggestionsForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
  const form = useForm<z.infer<typeof suggestionFormSchema>>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      message: '',
      wikipediaLink: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof suggestionFormSchema>) => {
    if (!(values.message.toString().trim().length > 0)) {
      toast.error('Message is empty!');
      return;
    }
    const id = toast.loading('Submitting your suggestion...');
    setIsOpen(false);
    try {
      const data = await fetch('/api/suggestion', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const result = await data.json();

      if (result.status === 200) {
        toast.success('Suggestion submitted successfully!', {
          id,
        });
      } else {
        if (
          result.statusMessage.includes(
            'Unique constraint failed on the fields: (`wikipediaLink`)',
          )
        ) {
          toast.error('Duplicate Wikipedia Link!', {
            id,
          });
        } else {
          toast.error(result.statusMessage, {
            id,
          });
        }
      }
    } catch (e) {
      toast.error((e as Error).message, {
        id,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder='e.g. I would like to suggest adding Alan Turing to the Great Minds list.'
                  {...field}
                />
              </FormControl>
              <FormDescription>Brief about your suggestion</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='wikipediaLink'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wikipedia Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. https://en.wikipedia.org/wiki/Alan_Turing'
                  type='url'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A wikipedia link of the person you want to suggest to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
