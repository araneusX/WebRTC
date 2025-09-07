<script lang="ts">
    import { InteractiveField } from './lib';

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

    let dataChannel: RTCDataChannel | null = $state(null);
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.createDataChannel('data-channel');

    peerConnection.addEventListener('datachannel', (event) => {
        dataChannel = event.channel;

        // dataChannel.addEventListener('message', (event) => {
        //   chat.addValue(event.data)
        // });

        // chat.addInputHandler((message) => {
        //   dataChannel.send(message);
        // });

        // dataChannel.addEventListener('open', event => {
        //   chat.setName('Chat/Connected')
        // });
    });

    peerConnection.createOffer().then(async (offer) => {
        await peerConnection.setLocalDescription(offer);

        peerConnection.addEventListener('icecandidate', (event) => {
            console.log('event', event);

            if (event.candidate) {
                myMessages.icecandidate.push(event.candidate);
            }
        });
        myMessages.offer = offer;
    });

    $effect(() => {
        if (incomingMessages.offer) {
            console.log('incomingMessages.offer', incomingMessages.offer);
            peerConnection.setRemoteDescription(new RTCSessionDescription(incomingMessages.offer));

            peerConnection.createAnswer().then(async (answer) => {
                await peerConnection.setLocalDescription(answer);
                myMessages.answer = answer;
            });
        }
    });

    $effect(() => {
        if (incomingMessages.answer) {
            console.log('incomingMessages.answer', incomingMessages.answer);
            peerConnection.setRemoteDescription(new RTCSessionDescription(incomingMessages.answer));
        }
    });

    $effect(() => {
        return () => {
            peerConnection.close();
        };
    });
</script>

<main>
    <div class="section-row">
        {#if !incomingMessages.offer}
            <InteractiveField data={myMessages.offer} name="My Offer" />
        {/if}
        {#if !incomingMessages.answer}
            <div>
                <InteractiveField bind:data={incomingMessages.offer} name="Incoming Offer" />
                {#if !incomingMessages.offer}
                    <InteractiveField bind:data={incomingMessages.answer} name="Incoming Answer" />
                {/if}
            </div>
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
</style>
