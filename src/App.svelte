<script lang="ts">
    import { InteractiveField } from './lib';
    import { movement, prepareAsset } from './lib/movement';

    type ConnectionMessages = {
        offer?: RTCSessionDescriptionInit;
        answer?: RTCSessionDescriptionInit;
        icecandidate: RTCIceCandidate[];
    };

    const myMessages: ConnectionMessages = $state({ icecandidate: [] });
    const incomingMessages: ConnectionMessages = $state({ icecandidate: [] });

    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
    };

    const peerConnection = new RTCPeerConnection(configuration);
    let role: 'offer' | 'answer' | undefined = $state();

    let dataChannel: RTCDataChannel | null = null;

    let canvas = $state<HTMLCanvasElement>();

    peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
            myMessages.icecandidate.push(event.candidate);
        }
    });

    $effect(() => {
        if (role === 'offer') {
            dataChannel = peerConnection.createDataChannel('data-channel');

            dataChannel.addEventListener('message', (event) => {
                hedgehogPosition = JSON.parse(event.data);
            });

            peerConnection.createOffer().then(async (offer) => {
                await peerConnection.setLocalDescription(offer);

                myMessages.offer = offer;
            });
        } else if (role === 'answer') {
            peerConnection.addEventListener('datachannel', (event) => {
                dataChannel = event.channel;

                dataChannel.addEventListener('message', (event) => {
                    hedgehogPosition = JSON.parse(event.data);
                });
            });
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (dataChannel?.readyState === 'open') {
            dataChannel.send(JSON.stringify({ x: event.clientX, y: event.clientY }));
        }
    });

    let hedgehogPosition = $state({ x: 5, y: 5, rotation: 0 });

    $effect(() => {
        if (incomingMessages.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(incomingMessages.offer));

            peerConnection.createAnswer().then(async (answer) => {
                await peerConnection.setLocalDescription(answer);
                myMessages.answer = answer;
            });
        }
    });

    $effect(() => {
        if (incomingMessages.answer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(incomingMessages.answer));
        }
    });

    $effect(() => {
        const latestIceCandidate = incomingMessages.icecandidate.at(-1);
        if (latestIceCandidate) {
            peerConnection.addIceCandidate(latestIceCandidate);
        }
    });

    $effect(() => {
        if (canvas) {
            const resize = () => {
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            };

            window.addEventListener('resize', resize);
            resize();
            const context = canvas.getContext('2d');
            const image = prepareAsset({ color: 'blue' });

            let timeout: ReturnType<typeof setTimeout>;

            image.then((image) => {
                if (context) {
                    const render = () => {
                        if (canvas) {
                            const point = movement.getNextPoint();
                            context.clearRect(0, 0, canvas.width, canvas.height);
                            context.save();
                            context.translate(point.x + 28, point.y + 28);
                            context.rotate(point.rotation);
                            context.translate(-28, -28);
                            context.drawImage(image, 0, 0);
                            context.restore();
                        }

                        timeout = setTimeout(() => requestAnimationFrame(render), 18);
                    };

                    render();
                }
            });

            return () => {
                clearTimeout(timeout);
                window.removeEventListener('resize', resize);
            };
        }
    });

    $effect(() => {
        return () => {
            dataChannel?.close();
            peerConnection.close();
        };
    });
</script>

<main>
    <div class="section-row">
        <label><input type="radio" bind:group={role} value="offer" readOnly={!!role} />Offer</label>
        <label><input type="radio" bind:group={role} value="answer" readOnly={!!role} />Answer</label>
    </div>
    <div class="section-row">
        {#if role === 'offer'}
            <InteractiveField data={myMessages.offer} name="My Offer" />
            {#if !incomingMessages.answer}
                <InteractiveField bind:data={incomingMessages.answer} name="Incoming Answer" />
            {/if}
        {:else if role === 'answer'}
            <InteractiveField bind:data={incomingMessages.offer} name="Incoming Offer" />
        {/if}
    </div>
    <div class="section-row">
        {#if incomingMessages.answer}
            <InteractiveField data={incomingMessages.answer} name="Incoming Answer" />
        {:else if myMessages.answer}
            <div>
                <InteractiveField bind:data={myMessages.answer} name="My Answer" />
            </div>
        {/if}
    </div>
    {#if myMessages.answer || incomingMessages.answer}
        <div class="section-row">
            <div class="section-col">
                {#each myMessages.icecandidate as candidate}
                    <InteractiveField data={candidate} name="My ICE Candidate" />
                {/each}
            </div>
            <div class="section-col">
                {#each incomingMessages.icecandidate as candidate}
                    <InteractiveField data={candidate} name="Incoming ICE Candidate" />
                {/each}
                {#key incomingMessages.icecandidate.length}
                    <InteractiveField
                        bind:data={incomingMessages.icecandidate[incomingMessages.icecandidate.length]}
                        name="Incoming ICE Candidate"
                    />
                {/key}
            </div>
        </div>
    {/if}
    <div class="forest">
        <!-- <Hedgehog
            color="blue"
            x="{hedgehogPosition.x}%"
            y="{hedgehogPosition.y}%"
            rotation={hedgehogPosition.rotation}
        /> -->
        <canvas bind:this={canvas}></canvas>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        padding: 2rem 0;
    }

    .section-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 800px;
        margin: 0 auto;
    }

    .section-row > :global(*) {
        flex: 1 1 0;
    }

    .section-col {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-self: stretch;
    }

    .forest {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
