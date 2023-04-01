'use client';

import { Field, Form } from 'houseform';
import { useRef, useState } from 'react';

import FeedList from '~/components/FeedList';
import useFeedCheck from '~/hooks/useFeedCheck';

export default function FeedLookup() {
  const [url, setUrl] = useState<string>('');
  const urlInputRef = useRef<HTMLInputElement>(null);
  const { feedUrls, isChecking, error } = useFeedCheck(url, urlInputRef);

  return (
    <div className='pt-8 w-full md:min-w-[640px] md:w-1/2'>
      <Form
        onSubmit={(values) => {
          setUrl(values.url);
        }}
      >
        {({ isValid, submit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className='flex justify-center items-center gap-2'>
              <Field name='url'>
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <input
                      className='border border-gray-300 p-2 w-full'
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={'URL'}
                      ref={urlInputRef}
                    />
                  );
                }}
              </Field>
              <button
                disabled={!isValid}
                className='border border-gray-300 px-4 py-2 rounded bg-sky-400 text-white'
                type='submit'
              >
                Lookup
              </button>
            </div>
          </form>
        )}
      </Form>

      <FeedList feedUrls={feedUrls} isChecking={isChecking} error={error} siteUrl={url} />
    </div>
  );
}
