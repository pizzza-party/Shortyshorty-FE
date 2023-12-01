import { SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const InputWrapper = styled.form`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Input = styled.input`
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 20px;
	width: 534px;
	height: 60px;
	font-size: 20px;
	outline: none;
	cursor: pointer;

	@media (max-width: 768px) {
		width: 367px;
		font-size: 17px;
	}
`;

const Button = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 0;
	padding: 8px;
	margin-right: 10px;
	background-color: #d9967e;
	color: #f2f2eb;
	border: 1px solid #d9967e;
	border-radius: 15px;
	font-size: 16px;
	cursor: pointer;

	&:hover {
		background-color: #b5645a;
	}

	@media (max-width: 768px) {
	}
`;

const HistoryList = styled.ul`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	list-style: none;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 0 0 20px 20px;
	background-color: #fff;
	z-index: 1;
`;

const HistoryItem = styled.li`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text-align: center;
	align-items: center;
	margin-bottom: 5px;
	position: relative;
	z-index: 1;
	cursor: pointer;
`;

const CopyButton = styled.button`
	background-color: #fffcfc;
	color: #d9967e;
	border: 1px solid #d9967e;
	border-radius: 20px;
	padding: 8px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	margin-right: 5px;
	cursor: pointer;
`;

const DeleteButton = styled.button`
	background-color: #fffcfc;
	color: #d9967e;
	border: 1px solid #d9967e;
	border-radius: 20px;
	padding: 8px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	cursor: pointer;
`;

const LatestShortURL = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text-align: center;
	align-items: center;
	padding: 15px;
	width: 534px;
	height: 60px;
	font-size: 20px;

	@media (max-width: 768px) {
		width: 367px;
		font-size: 17px;
	}
`;

export default function Main() {
	const [inputValue, setInputValue] = useState('');
	const [historyList, setHistoryList] = useState<string[]>([]);
	const [latestShortURL, setLatestShortURL] = useState<string>('');
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const searchRef = useRef(null);

	const inputChange = (e: { target: { value: SetStateAction<string> } }) => {
		setInputValue(e.target.value);
	};

	const shortenButtonClick = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() !== '') {
			setHistoryList((prevList) => [inputValue, ...prevList]);
			setInputValue('');
			setLatestShortURL(inputValue);
			setIsSearchOpen(false);
		}
	};

	const inputFocus = () => {
		setIsSearchOpen(true);
	};

	const handleCopyUrl = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			setIsCopied(true);

			setTimeout(()=>{
				setIsCopied(false);
			},2000);
		} catch (err) {
			console.error('failed copied',err);
		}
	};

	const handleDelete = (index: number) => {
		console.log('Delete button clicked');
		const updatedList = [...historyList];
		updatedList.splice(index, 1);
		setHistoryList(updatedList);
	};

	useEffect(() => {
		console.log('History List Updated:', historyList);
	}, [historyList]);

	const closeSearch = () => {
		setIsSearchOpen(false);
	};

	useOutsideClick({
		ref: searchRef,
		handler: closeSearch,
	});

	return (
		<Wrapper ref={searchRef}>
			<InputWrapper onSubmit={shortenButtonClick}>
				<Input
					type='text'
					placeholder='Please enter a long URL...'
					value={inputValue}
					onChange={inputChange}
					onFocus={inputFocus}
					style={{
						borderRadius:
							isSearchOpen && historyList.length > 0 ? '20px 20px 0 0' : '20px',
						borderBottom:
							isSearchOpen && historyList.length > 0
								? 'none'
								: '1px solid #ccc',
					}}
				/>
				<Button type='submit'>shorten</Button>
				{isSearchOpen && (
					<div>
						{historyList.length > 0 && (
							<HistoryList>
								{historyList.map((item, index) => (
									<HistoryItem key={index}>
										<span>{item}</span>
										<div>
											<CopyButton onClick={() => handleCopyUrl(item)} disabled={isCopied}>
												Copy
											</CopyButton>
											<DeleteButton onClick={() => handleDelete(index)}>
												Delete
											</DeleteButton>
										</div>
									</HistoryItem>
								))}
							</HistoryList>
						)}
					</div>
				)}
			</InputWrapper>
			<LatestShortURL>
				<span>{latestShortURL}</span>

				{latestShortURL ? (
					<CopyButton onClick={() => handleCopyUrl(latestShortURL)} disabled={isCopied}>
						Copy
					</CopyButton>
				) : (
					''
				)}
			</LatestShortURL>
		</Wrapper>
	);
}
