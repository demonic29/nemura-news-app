import Image from 'next/image';
import React, { useState } from 'react'

import sample from '@/public/sample.jpg';
import { Post } from '@/app/lib/post';

export default async function NewsDetailsPage({
    params
}: {
    params: Promise<{ id: string, post: Post}>
}) {

    const { id } = await params;

    return (
        <div>
            <div className={`bg-[url('/playlist-bg.png')] min-h-screen`}>
                <div className='w-full h-[300px] relative overflow-hidden'>
                    <Image
                        alt=''
                        fill
                        src={sample}
                        objectFit='cover'
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    <p className='absolute normal text-white bottom-4 ms-4'>{  }</p>
                </div>

                <div className='flex items-center justify-between mt-4 px-3'>
                    <div className='flex items-center gap-4'>
                        <div className='relative w-10 h-10'>
                            <Image
                                src={sample}
                                fill
                                alt='logo'
                                className='rounded-full object-cover'
                            />
                        </div>
                        <span className='normal text-white'>経済ニュース</span>
                    </div>

                    <button className='text-white normal bg-[#1D57A6] px-3 py-1 rounded-lg'>
                        再生
                        <i className="ms-2 fa-regular fa-circle-play"></i>
                    </button>
                </div>

                <div className='px-3 mt-4'>
                    <p className='normal text-white font-normal leading-6'>
                        兵庫県の内部告発問題を巡り、竹内英明前県議（当時５０歳）の名誉を傷つけたとして、政治団体「ＮＨＫから国民を守る党」党首の立花孝志容疑者（５８）が逮捕された事件で、接見した弁護士が１１日、立花容疑者が自身の発言や投稿について、「真実相当性はあった」と主張していることを明らかにした。
                    </p>
                </div>
            </div>

        </div>
    )
}
