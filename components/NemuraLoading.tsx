import React from 'react'
import LottiePlayer from './LottiePlayer'
import Fade from './Fade'
import smileNemura from '@/assets/animations/smile-nemura.json'

export default function NemuraLoading() {
    return (
        <Fade>
            <LottiePlayer data={smileNemura} width={200} height={200}/>
        </Fade>
    )
}
