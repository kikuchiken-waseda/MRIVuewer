import scipy as sp
from pyssp.util import (
    get_frame, add_signal, compute_avgpowerspectrum
)


def writeWav(param, signal, filename):
    import wave
    with wave.open(filename, 'wb') as wf:
        wf.setparams(param)
        s = sp.int16(signal * 32767.0).tostring()
        wf.writeframes(s)


def jointMap(signal, params, **kwargs):
    from pyssp.voice_enhancement import JointMap
    # Setting for JM
    ntime = kwargs.get('ntime', 300)
    ratio = kwargs.get('ratio', 0.9)
    winsize = kwargs.get('winsize', 256)
    alpha = kwargs.get('alpha', 0.99)
    constant = kwargs.get('constant', 0.001)
    window = sp.hanning(winsize)
    n_pow = compute_avgpowerspectrum(
        signal[0:winsize * int(params[2] / float(winsize) / (1000.0/ntime))],
        winsize, window
    )
    nf = int(len(signal) / (winsize / 2) - 1)
    result = sp.zeros(len(signal), sp.float32)
    ss = JointMap(
        winsize, window,
        alpha=alpha, ratio=ratio,
        constant=constant
    )
    for no in range(nf):
        s = get_frame(signal, winsize, no)
        add_signal(result, ss.compute_by_noise_pow(s, n_pow), winsize, no)
    return params, result


def videoRead(videoclip, winsize=256):
    from wave import open
    from os import remove
    tmp = 'tmp.wav'
    audioclip = videoclip.audio
    audioclip.write_audiofile(tmp)
    with open(tmp) as wf:
        n = wf.getnframes()
        frames = wf.readframes(n)
        params = (
            (
                wf.getnchannels(), wf.getsampwidth(), wf.getframerate(),
                wf.getnframes(), wf.getcomptype(), wf.getcompname()
            )
        )
        siglen = ((int)(len(frames) / 2 / winsize) + 1) * winsize
        signal = sp.zeros(siglen, sp.float32)
        signal[0:int(len(frames) / 2)] = sp.float32(
            sp.fromstring(frames, sp.int16)
        ) / 32767.0
    remove(tmp)
    return signal, params


def normalization_from_video(fname, outfile, **kwargs):
    from glob import glob
    from os import remove
    from moviepy.editor import VideoFileClip, AudioFileClip
    tmp = 'tmp.wav'
    video = VideoFileClip(fname)
    winsize = kwargs.get('winsize', 256)
    signal, params = videoRead(video, winsize)
    kwargs.update({'params': params})
    params, result = jointMap(signal, **kwargs)
    writeWav(params, result, tmp)
    newAudio = AudioFileClip(tmp)
    newVideo = video.set_audio(newAudio)
    newVideo.write_videofile(outfile)
    remove(tmp)
    for t in glob('*.mp3'):
        remove(t)
