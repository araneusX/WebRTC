type Point = {
    x: number;
    y: number;
};

type SimulationConfig = {
    chainLength: number;
    minDistance: number;
    canvasWidth: number;
    canvasHeight: number;
    smoothingFactor: number;
};

const createPoint = (x: number = 0, y: number = 0): Point => ({ x, y });

const getRandomNumber = (max: number): number => Math.floor(max * Math.random());

const calculateDistance = (point1: Point, point2: Point): number => {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.hypot(deltaX, deltaY);
};

const createMovement = (config: SimulationConfig) => {
    const { chainLength, minDistance, canvasWidth, canvasHeight, smoothingFactor } = config;

    const pointChain: Point[] = Array.from({ length: chainLength }, () => createPoint(0, 0));

    const updateTarget = (target: Point, nextPoint: Point) => {
        do {
            target.x = getRandomNumber(canvasWidth);
            target.y = getRandomNumber(canvasHeight);
        } while (calculateDistance(target, nextPoint) <= minDistance);
    };

    const updateChain = () => {
        for (let i = 1; i < pointChain.length; i++) {
            const currentPoint = pointChain[i];
            const previousPoint = pointChain[i - 1];

            currentPoint.x += smoothingFactor * (previousPoint.x - currentPoint.x);
            currentPoint.y += smoothingFactor * (previousPoint.y - currentPoint.y);
        }
    };

    let lastPoint: Point = { ...pointChain[pointChain.length - 1] };
    let vibration = 0;
    let vibrationDirection = 1;

    const getNextPoint = () => {
        const target = pointChain[0];
        const nextPoint = pointChain[pointChain.length - 1];

        if (vibration === 2) {
            vibrationDirection = -1;
        } else if (vibration === -2) {
            vibrationDirection = 1;
        }

        vibration += vibrationDirection;

        if (calculateDistance(target, nextPoint) <= minDistance) {
            updateTarget(target, nextPoint);
        }

        updateChain();

        const distance = calculateDistance(nextPoint, lastPoint);
        const rotation =
            Math.atan2((nextPoint.y - lastPoint.y) / distance, (nextPoint.x - lastPoint.x) / distance) -
            Math.PI / 2 +
            vibration * distance ** 2 * 0.001;

        lastPoint.x = nextPoint.x;
        lastPoint.y = nextPoint.y;

        return {
            ...nextPoint,
            rotation,
        };
    };

    return {
        getNextPoint,
    };
};

const defaultConfig: SimulationConfig = {
    chainLength: 8,
    minDistance: 200,
    canvasWidth: 800,
    canvasHeight: 600,
    smoothingFactor: 0.04,
};

export const movement = createMovement(defaultConfig);
