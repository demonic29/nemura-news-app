FROM voicevox/voicevox_engine:cpu-ubuntu20.04-latest
EXPOSE 50021
CMD ["run", "--host", "0.0.0.0", "--port", "50021"]
