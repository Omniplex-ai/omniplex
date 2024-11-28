import React, { useState } from 'react';
import styles from './Auth.module.css';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { useRouter } from 'next/navigation';
import { Modal, ModalContent } from '@nextui-org/modal';
import { useDispatch } from 'react-redux';
import { setAuthState, setUserDetailsState } from '@/store/authSlice';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Spinner from '../Spinner/Spinner';
import Logo from '../../../public/Logo.svg';
import { PLUGINS } from '@/utils/data';

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const Auth = (props: Props) => {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true })
	);
	const router = useRouter();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const handleAuth = async () => {
		setLoading(true);
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const userRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				await setDoc(
					userRef,
					{
						userDetails: {
							email: user.email,
							name: user.displayName,
							profilePic: user.photoURL,
						},
					},
					{ merge: true }
				);
			} else {
				await setDoc(userRef, {
					userDetails: {
						email: user.email,
						name: user.displayName,
						profilePic: user.photoURL,
						createdAt: serverTimestamp(),
					},
				});
			}

			dispatch(setAuthState(true));
			dispatch(
				setUserDetailsState({
					uid: user.uid,
					name: user.displayName ?? '',
					email: user.email ?? '',
					profilePic: user.photoURL ?? '',
				})
			);
			props.onClose();
			setLoading(false);
		} catch (error) {
			console.log('error', error);
			setLoading(false);
		}
	};

	return (
		<Modal
			size={'full'}
			radius='md'
			shadow='sm'
			backdrop={'blur'}
			isOpen={props.isOpen}
			onClose={props.onClose}
			placement='bottom-center'
			closeButton={<div></div>}
		>
			<ModalContent>
				{(onClose) => (
					<div className={styles.modal}>
						<div className={styles.titleContainer}>
							<div
								className={styles.close}
								onClick={() => {
									onClose();
								}}
							>
								<Image
									width={20}
									height={20}
									src={'/svgs/CrossWhite.svg'}
									alt={'X'}
								/>
							</div>
						</div>
						<div className={styles.container}>
							{/*'login half'*/}
							<div className={styles.loginPageContainer}>
								<Image
									src={Logo}
									alt='Logo'
									className={styles.loginPageLogo}
								/>
								<h1 className={styles.loginPageHeading}>
									Omniplex AI <br />
									Where Knowledge Evolves
								</h1>
								<div
									className={
										styles.loginDetailsContainer
									}
								>
									<h1 className={styles.title}>
										Welcome
									</h1>
									<p className={styles.text}>
										Let&apos;s Create Your Account
									</p>
									{loading ? (
										<div
											className={styles.button}
										>
											<div
												className={
													styles.spinner
												}
											>
												<Spinner />
											</div>
											<div
												className={
													styles.buttonText
												}
											>
												Signing in
											</div>
										</div>
									) : (
										<div
											className={styles.button}
											onClick={handleAuth}
										>
											<Image
												src={
													'/svgs/Google.svg'
												}
												alt={'Google'}
												width={24}
												height={24}
											/>
											<div
												className={
													styles.buttonText
												}
											>
												Continue with Google
											</div>
										</div>
									)}
								</div>
							</div>
							<div className={styles.carouselHolder}>
								{/*carousel showing the plugins*/}
								<h1 className={styles.carouselHeading}>
									Plugins available
								</h1>
								<Carousel
									plugins={[plugin.current]}
									className='w-full max-w-xs'
								>
									<CarouselContent>
										{PLUGINS.map(
											(plugin, index) => (
												<CarouselItem
													key={index}
												>
													<div className='p-1'>
														<Card
															className={
																styles.cardColor
															}
														>
															<CardContent className='d-flex flex-column aspect-square items-center justify-center p-6'>
																<p
																	className={
																		styles.cardSmallTitle
																	}
																>
																	Generate
																	Information
																	about
																</p>
																<h1 className='text-4xl font-semibold'>
																	{
																		plugin.name
																	}
																</h1>
																<p>
																	{
																		plugin.description
																	}
																</p>
																<Image
																	className='mt-4 rounded-lg'
																	width={
																		200
																	}
																	height={
																		200
																	}
																	alt={
																		plugin.name
																	}
																	src={
																		plugin.imageUrl
																	}
																></Image>
															</CardContent>
														</Card>
													</div>
												</CarouselItem>
											)
										)}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							</div>
						</div>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
};

export default Auth;

/*

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

*/
