import Image from 'next/image';
import { useRouter } from 'next/router';

import notFoundImage from '@/assets/images/404.webp';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="bg-(--color-background) h-screen flex flex-col justify-center items-center">
      <Image src={notFoundImage.src} alt="404 Not Found" width={260} height={195} />
      <h3 className="text-2xl text-white mt-12 mb-4 font-bold">요청하신 페이지를 찾을 수 없어요</h3>
      <p className="text-white text-[16px] leading-[22px] mb-10">
        여기에 당신과 저 빼고는 아무도 없는 것 같아요
      </p>
      <button
        className="bg-(--color-primary10) text-white py-2 rounded px-[100px] pt-[7px] pb-2.5"
        onClick={() => router.push('/')}
      >
        왓챠 구독으로 가기
      </button>
    </div>
  );
};

export default NotFound;
