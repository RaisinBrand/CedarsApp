import h5py
import numpy as np
import os


file_path = os.path.join(
    "h5_export",      
    "test5-5",        
    "kite_data.h5"    
)


with h5py.File(file_path, "r") as f:

    print("Datasets:", list(f.keys()))


    time = f["time"][:]       

    
    channels = {}
    for name in f:
        if name.startswith("ch_"):
            channels[name] = f[name][:]  


print("Time array:", time.shape)
for ch_name, data in channels.items():
    print(f"{ch_name}: {data.shape}")
