import type { ISourceOptions } from '@tsparticles/engine';

export const CONFETTI_OPTIONS: ISourceOptions = {
    fullScreen: {
        enable: false,
        zIndex: 0
    },
    particles: {
        number: {
            value: 0
        },
        color: {
            value: ["#00FFFC", "#FC00FF", "#ffb100"]
        },
        shape: {
            type: ["circle", "square"],
            options: {}
        },
        opacity: {
            value: {
                min: 0,
                max: 1
            },
            animation: {
                enable: true,
                speed: 2,
                sync: false,
                startValue: "max",
                destroy: "min"
            }
        },
        size: {
            value: {
                min: 3,
                max: 7
            }
        },
        life: {
            duration: {
                sync: true,
                value: 5
            },
            count: 1
        },
        move: {
            enable: true,
            gravity: {
                enable: true,
                acceleration: 15
            },
            speed: {
                min: 15,
                max: 35
            },
            decay: 0.1,
            direction: "top",
            random: false,
            straight: false,
            outModes: {
                default: "destroy",
                top: "none"
            }
        }
    },
    background: {
        color: {
            value: "transparent"
        }
    },
    emitters: {
        direction: "top",
        rate: {
            quantity: 10,
            delay: 0.1
        },
        size: {
            width: 100,
            height: 100
        },
        position: {
            y: 50,
            x: 50
        },
        life: {
            count: 0,
            duration: 0.1,
            delay: 0.1
        }
    }
};

export const BOOK_MAGIC_OPTIONS: ISourceOptions = {
    fullScreen: { enable: false },
    particles: {
        number: {
            value: 60,
            density: {
                enable: true,
                width: 800,
                height: 800
            }
        },
        color: {
            value: ["#FFD700", "#FFA500", "#FFFFFF"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: {
                enable: true,
                speed: 1,
                sync: false
            }
        },
        size: {
            value: { min: 1, max: 3 }
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: "out",
            path: {
                enable: true,
                options: {
                    type: "curl" // Trying a curl path for 'rotating' feel if supported, otherwise standard move
                }
            }
        }
    },
    background: {
        color: "transparent"
    }
};

export const VICTORY_CONFETTI_OPTIONS: ISourceOptions = {
    fullScreen: {
        enable: false,
        zIndex: 0
    },
    particles: {
        number: {
            value: 0
        },
        color: {
            value: ["#FFD700", "#FFFFFF", "#FFA500", "#FF4500", "#00FFFC"]
        },
        shape: {
            type: ["circle", "square"],
            options: {}
        },
        opacity: {
            value: {
                min: 0,
                max: 1
            },
            animation: {
                enable: true,
                speed: 1,
                sync: false,
                startValue: "max",
                destroy: "min"
            }
        },
        size: {
            value: {
                min: 2,
                max: 5
            }
        },
        life: {
            duration: {
                sync: true,
                value: 5
            },
            count: 1
        },
        move: {
            enable: true,
            gravity: {
                enable: true,
                acceleration: 20
            },
            speed: {
                min: 25,
                max: 100
            },
            decay: 0.05,
            direction: "top",
            random: true,
            straight: false,
            outModes: {
                default: "destroy",
                top: "none"
            }
        }
    },
    background: {
        color: {
            value: "transparent"
        }
    },
    emitters: [
        {
            direction: "top-right",
            rate: {
                quantity: 10,
                delay: 0.1
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                y: 100,
                x: 0
            }
        },
        {
            direction: "top-left",
            rate: {
                quantity: 10,
                delay: 0.1
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                y: 100,
                x: 100
            }
        }
    ]
};
