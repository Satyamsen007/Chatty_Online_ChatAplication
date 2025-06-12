import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthImagePattern = ({ title, subtitle }) => {
    const audioRefs = useRef([]);

    useEffect(() => {
        // Create multiple audio instances for each pattern
        audioRefs.current = Array(9).fill(null).map(() => {
            const audio = new Audio('/sounds/pop.mp3');
            audio.volume = 0.2;
            return audio;
        });

        // Cleanup
        return () => {
            audioRefs.current.forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, []);

    const playHoverSound = (index) => {
        const audio = audioRefs.current[index];
        if (audio) {
            // Create a new audio instance for each play
            const sound = new Audio('/sounds/pop.mp3');
            sound.volume = 0.2;
            sound.play().catch(() => { });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
        hover: {
            scale: 1.1,
            backgroundColor: "hsl(var(--p) / 0.2)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <div className='hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-12 relative overflow-hidden'>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-gradient-x" />

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-primary/10 blur-3xl"
                        style={{
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <motion.div
                className='max-w-md text-center mb-6 relative z-10'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className='grid grid-cols-3 gap-3 mb-8'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {[...Array(9)].map((_, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover="hover"
                            onHoverStart={() => playHoverSound(i)}
                            className={`
                                aspect-square rounded-2xl 
                                bg-gradient-to-br from-primary/10 to-secondary/10 
                                backdrop-blur-sm border border-primary/10
                                shadow-lg hover:shadow-xl
                                cursor-pointer
                                ${i % 2 === 0 ? 'animate-pulse' : ''}
                            `}
                        />
                    ))}
                </motion.div>

                <motion.h2
                    className='text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {title}
                </motion.h2>

                <motion.p
                    className='text-base-content/60 text-lg'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    {subtitle}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AuthImagePattern;
